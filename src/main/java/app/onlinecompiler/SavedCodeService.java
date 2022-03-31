package app.onlinecompiler;

import app.onlinecompiler.model.SavedCode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.Date;
import java.util.UUID;

@Service
@Transactional
public class SavedCodeService {

    @Autowired
    private SavedCodeRepository savedCodeRepository;

    public String save(SavedCode savedCode){
        savedCode.setExpiresOn(new Date());
        String codeTag = UUID.randomUUID().toString();
        savedCode.setCodeTag(codeTag);
        savedCodeRepository.save(savedCode);
        return codeTag;
    }

    public SavedCode getCodeByTag(String codeTag){
        return savedCodeRepository.findByCodeTag(codeTag).orElse(null);
    }

}
